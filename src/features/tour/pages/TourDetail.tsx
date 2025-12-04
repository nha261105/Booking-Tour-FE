"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "../../../components/common/Button"
import Modal from "../../../components/common/Modal"
import { useTour } from "../hooks/useTour"
import { formatCurrency } from "../../../utils/formatCurrency"
import { formatDate } from "../../../utils/formatDate"
import "./TourPages.scss"

export default function TourDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { loading, error, getTourById } = useTour()
  const [tour, setTour] = useState<any>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [participants, setParticipants] = useState(1)

  useEffect(() => {
    if (id) {
      getTourById(id).then((data) => {
        if (data) setTour(data)
      })
    }
  }, [id])

  const handleBooking = () => {
    const isAuthenticated = !!localStorage.getItem("accessToken")
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    setShowBookingModal(true)
  }

  const handleConfirmBooking = () => {
    navigate("/bookings", { state: { tourId: id, participants } })
  }

  if (loading) return <div className="loading">Đang tải...</div>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!tour) return <div className="alert alert-error">Tour không tìm thấy</div>

  return (
    <div className="tour-detail-page">
      <button className="back-btn" onClick={() => navigate("/tours")}>
        ← Quay lại
      </button>

      <div className="tour-detail-header">
          <div className="tour-detail-image">
            <img
              src={tour.image?.startsWith("http") ? tour.image : `http://localhost:8081${tour.image}`}
              alt={tour.name}
            />
          </div>

        <div className="tour-detail-info">
          <div className="tour-meta">
            <span className="category">{tour.category}</span>
            <span className="rating">
              ⭐ {tour.rating} ({tour.reviews} đánh giá)
            </span>
          </div>

          <h1>{tour.name}</h1>
          <p className="location">📍 {tour.location}</p>

          <div className="tour-highlights">
            <div className="highlight">
              <span className="icon">📅</span>
              <div>
                <p className="label">Thời gian</p>
                <p className="value">{tour.duration} ngày</p>
              </div>
            </div>
            <div className="highlight">
              <span className="icon">👥</span>
              <div>
                <p className="label">Người tham gia</p>
                <p className="value">
                  {tour.currentParticipants}/{tour.maxParticipants}
                </p>
              </div>
            </div>
            <div className="highlight">
              <span className="icon">📍</span>
              <div>
                <p className="label">Khởi hành</p>
                <p className="value">{formatDate(tour.startDate)}</p>
              </div>
            </div>
          </div>

          <div className="tour-price-section">
            <div className="price-info">
              <p className="price-label">Giá mỗi người</p>
              <p className="price-amount">{formatCurrency(tour.price)}</p>
            </div>
            <Button size="lg" onClick={handleBooking}>
              Đặt Tour Ngay
            </Button>
          </div>
        </div>
      </div>

      <div className="tour-detail-content">
        <div className="detail-section">
          <h2>Mô Tả</h2>
          <p>{tour.description}</p>
        </div>

        <div className="detail-section">
          <h2>Lịch Trình</h2>
          <div className="itinerary">
            <div className="itinerary-item">
              <span className="day">Ngày 1</span>
              <p>Khởi hành từ thành phố, tham quan các điểm du lịch chính</p>
            </div>
            <div className="itinerary-item">
              <span className="day">Ngày 2-{tour.duration - 1}</span>
              <p>Khám phá các địa điểm nổi tiếng, tham gia các hoạt động thú vị</p>
            </div>
            <div className="itinerary-item">
              <span className="day">Ngày {tour.duration}</span>
              <p>Trở về thành phố, kết thúc chuyến du lịch</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Bao Gồm</h2>
          <ul className="includes-list">
            <li>✓ Vé máy bay khứ hồi</li>
            <li>✓ Khách sạn 4-5 sao</li>
            <li>✓ Bữa ăn sáng hàng ngày</li>
            <li>✓ Hướng dẫn viên du lịch chuyên nghiệp</li>
            <li>✓ Bảo hiểm du lịch</li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>Điều Kiện & Chính Sách</h2>
          <ul className="policy-list">
            <li>Hủy miễn phí trước 7 ngày</li>
            <li>Hoàn tiền 50% nếu hủy trước 3 ngày</li>
            <li>Không hoàn tiền nếu hủy dưới 3 ngày</li>
          </ul>
        </div>
      </div>

      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Xác Nhận Đặt Tour">
        <div className="booking-modal-content">
          <div className="booking-info">
            <p>
              <strong>Tour:</strong> {tour.name}
            </p>
            <p>
              <strong>Giá mỗi người:</strong> {formatCurrency(tour.price)}
            </p>
          </div>

          <div className="participants-selector">
            <label>Số lượng người tham gia:</label>
            <div className="selector">
              <button onClick={() => setParticipants(Math.max(1, participants - 1))}>-</button>
              <input type="number" value={participants} readOnly />
              <button
                onClick={() =>
                  setParticipants(Math.min(tour.maxParticipants - tour.currentParticipants, participants + 1))
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="total-price">
            <p>
              <strong>Tổng cộng:</strong> {formatCurrency(tour.price * participants)}
            </p>
          </div>

          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmBooking}>Tiếp Tục Đặt</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
